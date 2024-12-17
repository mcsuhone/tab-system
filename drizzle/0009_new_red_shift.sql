ALTER TABLE "activity_logs" RENAME COLUMN "type" TO "action";--> statement-breakpoint
ALTER TABLE "activity_logs" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD COLUMN "details" jsonb;
COMMIT;

-- Create function for product changes
CREATE OR REPLACE FUNCTION log_product_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO activity_logs (action, details)
        VALUES (
            'PRODUCT_CREATED',
            jsonb_build_object(
                'product_id', NEW.id,
                'name', NEW.name,
                'category', NEW.category,
                'price', NEW.price
            )
        );
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO activity_logs (action, details)
        VALUES (
            'PRODUCT_UPDATED',
            jsonb_build_object(
                'product_id', NEW.id,
                'old_values', jsonb_build_object(
                    'name', OLD.name,
                    'category', OLD.category,
                    'price', OLD.price,
                    'disabled', OLD.disabled
                ),
                'new_values', jsonb_build_object(
                    'name', NEW.name,
                    'category', NEW.category,
                    'price', NEW.price,
                    'disabled', NEW.disabled
                )
            )
        );
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO activity_logs (action, details)
        VALUES (
            'PRODUCT_DELETED',
            jsonb_build_object(
                'product_id', OLD.id,
                'name', OLD.name
            )
        );
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function for user changes
CREATE OR REPLACE FUNCTION log_user_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO activity_logs (action, details)
        VALUES (
            'USER_CREATED',
            jsonb_build_object(
                'user_id', NEW.id,
                'name', NEW.name,
                'member_no', NEW.member_no,
                'permission', NEW.permission
            )
        );
    ELSIF TG_OP = 'UPDATE' THEN
        -- Only log relevant changes
        IF OLD.name != NEW.name OR 
           OLD.permission != NEW.permission OR 
           OLD.balance != NEW.balance THEN
            INSERT INTO activity_logs (action, details)
            VALUES (
                'USER_UPDATED',
                jsonb_build_object(
                    'user_id', NEW.id,
                    'old_values', jsonb_build_object(
                        'name', OLD.name,
                        'permission', OLD.permission,
                        'balance', OLD.balance
                    ),
                    'new_values', jsonb_build_object(
                        'name', NEW.name,
                        'permission', NEW.permission,
                        'balance', NEW.balance
                    )
                )
            );
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function for transaction logging
CREATE OR REPLACE FUNCTION log_transaction_created()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO activity_logs (action, details, user_id)
    VALUES (
        'TRANSACTION_CREATED',
        jsonb_build_object(
            'transaction_id', NEW.id,
            'amount', NEW.amount,
            'product_id', NEW.product_id
        ),
        NEW.user_id
    );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS log_product_changes_trigger ON products;
CREATE TRIGGER log_product_changes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION log_product_changes();

DROP TRIGGER IF EXISTS log_user_changes_trigger ON users;
CREATE TRIGGER log_user_changes_trigger
    AFTER INSERT OR UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION log_user_changes();

DROP TRIGGER IF EXISTS log_transaction_created_trigger ON transactions;
CREATE TRIGGER log_transaction_created_trigger
    AFTER INSERT ON transactions
    FOR EACH ROW EXECUTE FUNCTION log_transaction_created(); 